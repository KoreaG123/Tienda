# ========== BARCALM Store - Backend con Flask ==========

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3
import hashlib
import secrets
import os

app = Flask(__name__)
CORS(app)  # Permitir CORS para desarrollo

# Configuración
DATABASE = 'database/tienda.db'
SECRET_KEY = secrets.token_hex(32)
app.config['SECRET_KEY'] = SECRET_KEY

# ========== Inicializar Base de Datos ==========
def init_db():
    """Inicializar la base de datos con las tablas necesarias"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Tabla de usuarios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            telefono TEXT,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            activo INTEGER DEFAULT 1
        )
    ''')
    
    # Tabla de productos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            precio REAL NOT NULL,
            precio_antiguo REAL,
            stock INTEGER DEFAULT 0,
            imagen TEXT,
            categoria TEXT,
            tallas TEXT,
            colores TEXT,
            destacado INTEGER DEFAULT 0,
            nuevo INTEGER DEFAULT 0,
            descuento INTEGER DEFAULT 0,
            rating REAL DEFAULT 0,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de pedidos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_pedido TEXT UNIQUE NOT NULL,
            id_usuario INTEGER,
            nombre_cliente TEXT NOT NULL,
            email_cliente TEXT NOT NULL,
            telefono_cliente TEXT NOT NULL,
            direccion TEXT NOT NULL,
            distrito TEXT NOT NULL,
            referencia TEXT,
            metodo_entrega TEXT NOT NULL,
            metodo_pago TEXT NOT NULL,
            subtotal REAL NOT NULL,
            envio REAL NOT NULL,
            descuento REAL DEFAULT 0,
            total REAL NOT NULL,
            estado TEXT DEFAULT 'pendiente',
            notas TEXT,
            fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
        )
    ''')
    
    # Tabla de detalle de pedido
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS detalle_pedido (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_pedido INTEGER NOT NULL,
            id_producto INTEGER NOT NULL,
            nombre_producto TEXT NOT NULL,
            precio REAL NOT NULL,
            cantidad INTEGER NOT NULL,
            talla TEXT,
            color TEXT,
            FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
            FOREIGN KEY (id_producto) REFERENCES productos(id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print("✅ Base de datos inicializada")

# ========== Utilidades ==========
def get_db_connection():
    """Obtener conexión a la base de datos"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password):
    """Hashear contraseña"""
    return hashlib.sha256(password.encode()).hexdigest()

# ========== RUTAS - Productos ==========

@app.route('/api/productos', methods=['GET'])
def get_productos():
    """Obtener todos los productos"""
    conn = get_db_connection()
    productos = conn.execute('SELECT * FROM productos WHERE stock > 0').fetchall()
    conn.close()
    
    return jsonify([dict(producto) for producto in productos])

@app.route('/api/productos/<int:id>', methods=['GET'])
def get_producto(id):
    """Obtener un producto específico"""
    conn = get_db_connection()
    producto = conn.execute('SELECT * FROM productos WHERE id = ?', (id,)).fetchone()
    conn.close()
    
    if producto is None:
        return jsonify({'error': 'Producto no encontrado'}), 404
    
    return jsonify(dict(producto))

@app.route('/api/productos', methods=['POST'])
def create_producto():
    """Crear un nuevo producto (Admin)"""
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO productos (nombre, descripcion, precio, precio_antiguo, stock, 
                              imagen, categoria, tallas, colores, destacado, nuevo, descuento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['nombre'],
        data.get('descripcion'),
        data['precio'],
        data.get('precio_antiguo'),
        data.get('stock', 0),
        data.get('imagen'),
        data.get('categoria'),
        data.get('tallas'),
        data.get('colores'),
        data.get('destacado', 0),
        data.get('nuevo', 0),
        data.get('descuento', 0)
    ))
    
    conn.commit()
    producto_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'id': producto_id, 'mensaje': 'Producto creado exitosamente'}), 201

# ========== RUTAS - Usuarios ==========

@app.route('/api/usuarios/registro', methods=['POST'])
def registro_usuario():
    """Registrar un nuevo usuario"""
    data = request.json
    
    # Validar datos
    if not all(k in data for k in ['nombre', 'email', 'password']):
        return jsonify({'error': 'Datos incompletos'}), 400
    
    # Hashear contraseña
    password_hash = hash_password(data['password'])
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO usuarios (nombre, email, password, telefono)
            VALUES (?, ?, ?, ?)
        ''', (data['nombre'], data['email'], password_hash, data.get('telefono')))
        
        conn.commit()
        usuario_id = cursor.lastrowid
        conn.close()
        
        return jsonify({
            'id': usuario_id,
            'mensaje': 'Usuario registrado exitosamente'
        }), 201
        
    except sqlite3.IntegrityError:
        return jsonify({'error': 'El email ya está registrado'}), 409

@app.route('/api/usuarios/login', methods=['POST'])
def login_usuario():
    """Login de usuario"""
    data = request.json
    
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Datos incompletos'}), 400
    
    password_hash = hash_password(data['password'])
    
    conn = get_db_connection()
    usuario = conn.execute(
        'SELECT * FROM usuarios WHERE email = ? AND password = ? AND activo = 1',
        (data['email'], password_hash)
    ).fetchone()
    conn.close()
    
    if usuario is None:
        return jsonify({'error': 'Credenciales inválidas'}), 401
    
    return jsonify({
        'id': usuario['id'],
        'nombre': usuario['nombre'],
        'email': usuario['email'],
        'mensaje': 'Login exitoso'
    })

# ========== RUTAS - Pedidos ==========

@app.route('/api/pedidos', methods=['POST'])
def crear_pedido():
    """Crear un nuevo pedido"""
    data = request.json
    
    # Generar número de pedido único
    numero_pedido = f"#{datetime.now().timestamp()}{secrets.randbelow(1000)}"[:10]
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Insertar pedido
        cursor.execute('''
            INSERT INTO pedidos (
                numero_pedido, id_usuario, nombre_cliente, email_cliente, 
                telefono_cliente, direccion, distrito, referencia, 
                metodo_entrega, metodo_pago, subtotal, envio, 
                descuento, total, notas
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            numero_pedido,
            data.get('id_usuario'),
            data['nombre_cliente'],
            data['email_cliente'],
            data['telefono_cliente'],
            data['direccion'],
            data['distrito'],
            data.get('referencia'),
            data['metodo_entrega'],
            data['metodo_pago'],
            data['subtotal'],
            data['envio'],
            data.get('descuento', 0),
            data['total'],
            data.get('notas')
        ))
        
        pedido_id = cursor.lastrowid
        
        # Insertar detalles del pedido
        for producto in data['productos']:
            cursor.execute('''
                INSERT INTO detalle_pedido (
                    id_pedido, id_producto, nombre_producto, 
                    precio, cantidad, talla, color
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                pedido_id,
                producto['id'],
                producto['nombre'],
                producto['precio'],
                producto['cantidad'],
                producto.get('talla'),
                producto.get('color')
            ))
            
            # Actualizar stock
            cursor.execute('''
                UPDATE productos 
                SET stock = stock - ? 
                WHERE id = ?
            ''', (producto['cantidad'], producto['id']))
        
        conn.commit()
        conn.close()
        
        # Aquí se enviarían las notificaciones (email, WhatsApp)
        # enviar_email_confirmacion(data['email_cliente'], numero_pedido)
        # enviar_whatsapp_notificacion(numero_pedido)
        
        return jsonify({
            'numero_pedido': numero_pedido,
            'mensaje': 'Pedido creado exitosamente'
        }), 201
        
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 500

@app.route('/api/pedidos/<numero_pedido>', methods=['GET'])
def get_pedido(numero_pedido):
    """Obtener detalles de un pedido"""
    conn = get_db_connection()
    
    pedido = conn.execute(
        'SELECT * FROM pedidos WHERE numero_pedido = ?',
        (numero_pedido,)
    ).fetchone()
    
    if pedido is None:
        conn.close()
        return jsonify({'error': 'Pedido no encontrado'}), 404
    
    detalles = conn.execute(
        'SELECT * FROM detalle_pedido WHERE id_pedido = ?',
        (pedido['id'],)
    ).fetchall()
    
    conn.close()
    
    return jsonify({
        'pedido': dict(pedido),
        'productos': [dict(detalle) for detalle in detalles]
    })

@app.route('/api/pedidos/<int:id>/estado', methods=['PUT'])
def actualizar_estado_pedido(id):
    """Actualizar estado de un pedido (Admin)"""
    data = request.json
    nuevo_estado = data.get('estado')
    
    if nuevo_estado not in ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']:
        return jsonify({'error': 'Estado inválido'}), 400
    
    conn = get_db_connection()
    conn.execute('UPDATE pedidos SET estado = ? WHERE id = ?', (nuevo_estado, id))
    conn.commit()
    conn.close()
    
    return jsonify({'mensaje': 'Estado actualizado exitosamente'})

# ========== RUTAS - Estadísticas (Admin) ==========

@app.route('/api/admin/stats', methods=['GET'])
def get_estadisticas():
    """Obtener estadísticas generales"""
    conn = get_db_connection()
    
    # Ventas del día
    ventas_hoy = conn.execute('''
        SELECT COUNT(*) as cantidad, SUM(total) as total
        FROM pedidos
        WHERE DATE(fecha_pedido) = DATE('now')
    ''').fetchone()
    
    # Pedidos pendientes
    pedidos_pendientes = conn.execute('''
        SELECT COUNT(*) as cantidad
        FROM pedidos
        WHERE estado = 'pendiente'
    ''').fetchone()
    
    # Ingresos mensuales
    ingresos_mes = conn.execute('''
        SELECT SUM(total) as total
        FROM pedidos
        WHERE strftime('%Y-%m', fecha_pedido) = strftime('%Y-%m', 'now')
        AND estado != 'cancelado'
    ''').fetchone()
    
    # Total clientes
    total_clientes = conn.execute('SELECT COUNT(*) as cantidad FROM usuarios').fetchone()
    
    conn.close()
    
    return jsonify({
        'ventas_hoy': {
            'cantidad': ventas_hoy['cantidad'],
            'total': ventas_hoy['total'] or 0
        },
        'pedidos_pendientes': pedidos_pendientes['cantidad'],
        'ingresos_mes': ingresos_mes['total'] or 0,
        'total_clientes': total_clientes['cantidad']
    })

# ========== RUTA PRINCIPAL ==========

@app.route('/')
def index():
    return jsonify({
        'mensaje': 'BARCALM API',
        'version': '1.0',
        'endpoints': {
            'productos': '/api/productos',
            'registro': '/api/usuarios/registro',
            'login': '/api/usuarios/login',
            'pedidos': '/api/pedidos'
        }
    })

# ========== EJECUTAR APLICACIÓN ==========

if __name__ == '__main__':
    # Crear directorio de base de datos si no existe
    os.makedirs('database', exist_ok=True)
    
    # Inicializar base de datos
    init_db()
    
    # Ejecutar aplicación
    print("\n" + "="*50)
    print("🛍️  BARCALM Store Backend")
    print("="*50)
    print("📡 Servidor corriendo en: http://localhost:5000")
    print("📊 Base de datos: database/tienda.db")
    print("="*50 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
