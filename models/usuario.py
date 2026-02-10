# ========== Modelo de Usuario ==========

import sqlite3
import hashlib
from datetime import datetime

class Usuario:
    """Modelo para gestionar usuarios"""
    
    def __init__(self, db_path='database/tienda.db'):
        self.db_path = db_path
    
    def get_connection(self):
        """Obtener conexión a la base de datos"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def hash_password(self, password):
        """Hashear contraseña con SHA256"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def crear(self, datos):
        """Crear un nuevo usuario"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Hashear contraseña
        password_hash = self.hash_password(datos['password'])
        
        try:
            cursor.execute('''
                INSERT INTO usuarios (nombre, email, password, telefono)
                VALUES (?, ?, ?, ?)
            ''', (
                datos['nombre'],
                datos['email'],
                password_hash,
                datos.get('telefono', '')
            ))
            
            conn.commit()
            usuario_id = cursor.lastrowid
            conn.close()
            
            return usuario_id
            
        except sqlite3.IntegrityError:
            conn.close()
            return None  # Email ya existe
    
    def autenticar(self, email, password):
        """Autenticar un usuario"""
        conn = self.get_connection()
        password_hash = self.hash_password(password)
        
        usuario = conn.execute('''
            SELECT id, nombre, email, telefono 
            FROM usuarios 
            WHERE email = ? AND password = ? AND activo = 1
        ''', (email, password_hash)).fetchone()
        
        conn.close()
        
        return dict(usuario) if usuario else None
    
    def obtener_por_id(self, usuario_id):
        """Obtener usuario por ID"""
        conn = self.get_connection()
        usuario = conn.execute('''
            SELECT id, nombre, email, telefono, fecha_registro
            FROM usuarios
            WHERE id = ? AND activo = 1
        ''', (usuario_id,)).fetchone()
        conn.close()
        
        return dict(usuario) if usuario else None
    
    def obtener_por_email(self, email):
        """Obtener usuario por email"""
        conn = self.get_connection()
        usuario = conn.execute('''
            SELECT id, nombre, email, telefono, fecha_registro
            FROM usuarios
            WHERE email = ? AND activo = 1
        ''', (email,)).fetchone()
        conn.close()
        
        return dict(usuario) if usuario else None
    
    def actualizar(self, usuario_id, datos):
        """Actualizar datos del usuario"""
        conn = self.get_connection()
        
        campos_actualizar = []
        valores = []
        
        for campo in ['nombre', 'telefono']:
            if campo in datos:
                campos_actualizar.append(f'{campo} = ?')
                valores.append(datos[campo])
        
        # Cambiar contraseña si se proporciona
        if 'password' in datos:
            campos_actualizar.append('password = ?')
            valores.append(self.hash_password(datos['password']))
        
        if not campos_actualizar:
            conn.close()
            return False
        
        valores.append(usuario_id)
        query = f"UPDATE usuarios SET {', '.join(campos_actualizar)} WHERE id = ?"
        
        conn.execute(query, valores)
        conn.commit()
        conn.close()
        
        return True
    
    def desactivar(self, usuario_id):
        """Desactivar usuario (soft delete)"""
        conn = self.get_connection()
        conn.execute('UPDATE usuarios SET activo = 0 WHERE id = ?', (usuario_id,))
        conn.commit()
        conn.close()
        
        return True
    
    def obtener_todos(self):
        """Obtener todos los usuarios activos"""
        conn = self.get_connection()
        usuarios = conn.execute('''
            SELECT id, nombre, email, telefono, fecha_registro
            FROM usuarios
            WHERE activo = 1
            ORDER BY fecha_registro DESC
        ''').fetchall()
        conn.close()
        
        return [dict(u) for u in usuarios]
