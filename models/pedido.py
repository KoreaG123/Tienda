# ========== Modelo de Pedido ==========

import sqlite3
import secrets
from datetime import datetime

class Pedido:
    """Modelo para gestionar pedidos"""
    
    def __init__(self, db_path='database/tienda.db'):
        self.db_path = db_path
    
    def get_connection(self):
        """Obtener conexión a la base de datos"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def generar_numero_pedido(self):
        """Generar un número de pedido único"""
        timestamp = int(datetime.now().timestamp())
        random = secrets.randbelow(1000)
        return f"#{timestamp}{random}"[:10]
    
    def crear(self, datos):
        """Crear un nuevo pedido"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        numero_pedido = self.generar_numero_pedido()
        
        try:
            # Insertar pedido principal
            cursor.execute('''
                INSERT INTO pedidos (
                    numero_pedido, id_usuario, nombre_cliente, email_cliente,
                    telefono_cliente, direccion, distrito, referencia,
                    metodo_entrega, metodo_pago, subtotal, envio,
                    descuento, total, notas
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                numero_pedido,
                datos.get('id_usuario'),
                datos['nombre_cliente'],
                datos['email_cliente'],
                datos['telefono_cliente'],
                datos['direccion'],
                datos['distrito'],
                datos.get('referencia', ''),
                datos['metodo_entrega'],
                datos['metodo_pago'],
                datos['subtotal'],
                datos['envio'],
                datos.get('descuento', 0),
                datos['total'],
                datos.get('notas', '')
            ))
            
            pedido_id = cursor.lastrowid
            
            # Insertar productos del pedido
            for producto in datos['productos']:
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
                    producto.get('talla', ''),
                    producto.get('color', '')
                ))
                
                # Actualizar stock del producto
                cursor.execute('''
                    UPDATE productos
                    SET stock = stock - ?
                    WHERE id = ?
                ''', (producto['cantidad'], producto['id']))
            
            conn.commit()
            conn.close()
            
            return numero_pedido
            
        except Exception as e:
            conn.rollback()
            conn.close()
            raise e
    
    def obtener_por_numero(self, numero_pedido):
        """Obtener pedido por número"""
        conn = self.get_connection()
        
        pedido = conn.execute('''
            SELECT * FROM pedidos WHERE numero_pedido = ?
        ''', (numero_pedido,)).fetchone()
        
        if not pedido:
            conn.close()
            return None
        
        # Obtener productos del pedido
        productos = conn.execute('''
            SELECT * FROM detalle_pedido WHERE id_pedido = ?
        ''', (pedido['id'],)).fetchall()
        
        conn.close()
        
        return {
            'pedido': dict(pedido),
            'productos': [dict(p) for p in productos]
        }
    
    def obtener_por_id(self, pedido_id):
        """Obtener pedido por ID"""
        conn = self.get_connection()
        
        pedido = conn.execute('''
            SELECT * FROM pedidos WHERE id = ?
        ''', (pedido_id,)).fetchone()
        
        if not pedido:
            conn.close()
            return None
        
        productos = conn.execute('''
            SELECT * FROM detalle_pedido WHERE id_pedido = ?
        ''', (pedido_id,)).fetchall()
        
        conn.close()
        
        return {
            'pedido': dict(pedido),
            'productos': [dict(p) for p in productos]
        }
    
    def obtener_por_usuario(self, usuario_id):
        """Obtener todos los pedidos de un usuario"""
        conn = self.get_connection()
        
        pedidos = conn.execute('''
            SELECT * FROM pedidos 
            WHERE id_usuario = ?
            ORDER BY fecha_pedido DESC
        ''', (usuario_id,)).fetchall()
        
        conn.close()
        
        return [dict(p) for p in pedidos]
    
    def obtener_todos(self, filtros=None):
        """Obtener todos los pedidos con filtros opcionales"""
        conn = self.get_connection()
        query = 'SELECT * FROM pedidos'
        params = []
        
        if filtros:
            condiciones = []
            
            if 'estado' in filtros:
                condiciones.append('estado = ?')
                params.append(filtros['estado'])
            
            if 'fecha_desde' in filtros:
                condiciones.append('DATE(fecha_pedido) >= ?')
                params.append(filtros['fecha_desde'])
            
            if 'fecha_hasta' in filtros:
                condiciones.append('DATE(fecha_pedido) <= ?')
                params.append(filtros['fecha_hasta'])
            
            if condiciones:
                query += ' WHERE ' + ' AND '.join(condiciones)
        
        query += ' ORDER BY fecha_pedido DESC'
        
        pedidos = conn.execute(query, params).fetchall()
        conn.close()
        
        return [dict(p) for p in pedidos]
    
    def actualizar_estado(self, pedido_id, nuevo_estado):
        """Actualizar el estado de un pedido"""
        estados_validos = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']
        
        if nuevo_estado not in estados_validos:
            return False
        
        conn = self.get_connection()
        conn.execute('''
            UPDATE pedidos SET estado = ? WHERE id = ?
        ''', (nuevo_estado, pedido_id))
        conn.commit()
        conn.close()
        
        return True
    
    def obtener_estadisticas(self):
        """Obtener estadísticas de pedidos"""
        conn = self.get_connection()
        
        # Ventas del día
        ventas_hoy = conn.execute('''
            SELECT COUNT(*) as cantidad, COALESCE(SUM(total), 0) as total
            FROM pedidos
            WHERE DATE(fecha_pedido) = DATE('now')
            AND estado != 'cancelado'
        ''').fetchone()
        
        # Pedidos pendientes
        pedidos_pendientes = conn.execute('''
            SELECT COUNT(*) as cantidad
            FROM pedidos
            WHERE estado = 'pendiente'
        ''').fetchone()
        
        # Ingresos del mes
        ingresos_mes = conn.execute('''
            SELECT COALESCE(SUM(total), 0) as total
            FROM pedidos
            WHERE strftime('%Y-%m', fecha_pedido) = strftime('%Y-%m', 'now')
            AND estado != 'cancelado'
        ''').fetchone()
        
        # Total de pedidos
        total_pedidos = conn.execute('''
            SELECT COUNT(*) as cantidad
            FROM pedidos
        ''').fetchone()
        
        conn.close()
        
        return {
            'ventas_hoy': {
                'cantidad': ventas_hoy['cantidad'],
                'total': float(ventas_hoy['total'])
            },
            'pedidos_pendientes': pedidos_pendientes['cantidad'],
            'ingresos_mes': float(ingresos_mes['total']),
            'total_pedidos': total_pedidos['cantidad']
        }
