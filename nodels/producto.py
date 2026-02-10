# ========== Modelo de Producto ==========

import sqlite3
from datetime import datetime

class Producto:
    """Modelo para gestionar productos"""
    
    def __init__(self, db_path='database/tienda.db'):
        self.db_path = db_path
    
    def get_connection(self):
        """Obtener conexión a la base de datos"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def obtener_todos(self, filtros=None):
        """Obtener todos los productos con filtros opcionales"""
        conn = self.get_connection()
        query = 'SELECT * FROM productos WHERE stock > 0'
        params = []
        
        if filtros:
            if 'categoria' in filtros:
                query += ' AND categoria = ?'
                params.append(filtros['categoria'])
            
            if 'precio_min' in filtros:
                query += ' AND precio >= ?'
                params.append(filtros['precio_min'])
            
            if 'precio_max' in filtros:
                query += ' AND precio <= ?'
                params.append(filtros['precio_max'])
            
            if 'destacado' in filtros:
                query += ' AND destacado = 1'
            
            if 'nuevo' in filtros:
                query += ' AND nuevo = 1'
        
        productos = conn.execute(query, params).fetchall()
        conn.close()
        
        return [dict(p) for p in productos]
    
    def obtener_por_id(self, producto_id):
        """Obtener un producto por ID"""
        conn = self.get_connection()
        producto = conn.execute(
            'SELECT * FROM productos WHERE id = ?',
            (producto_id,)
        ).fetchone()
        conn.close()
        
        return dict(producto) if producto else None
    
    def crear(self, datos):
        """Crear un nuevo producto"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO productos (
                nombre, descripcion, precio, precio_antiguo, stock,
                imagen, categoria, tallas, colores, destacado, nuevo, descuento
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            datos['nombre'],
            datos.get('descripcion', ''),
            datos['precio'],
            datos.get('precio_antiguo'),
            datos.get('stock', 0),
            datos.get('imagen', ''),
            datos.get('categoria', ''),
            datos.get('tallas', ''),
            datos.get('colores', ''),
            datos.get('destacado', 0),
            datos.get('nuevo', 0),
            datos.get('descuento', 0)
        ))
        
        conn.commit()
        producto_id = cursor.lastrowid
        conn.close()
        
        return producto_id
    
    def actualizar(self, producto_id, datos):
        """Actualizar un producto"""
        conn = self.get_connection()
        
        campos_actualizar = []
        valores = []
        
        for campo in ['nombre', 'descripcion', 'precio', 'precio_antiguo', 
                     'stock', 'imagen', 'categoria', 'tallas', 'colores',
                     'destacado', 'nuevo', 'descuento']:
            if campo in datos:
                campos_actualizar.append(f'{campo} = ?')
                valores.append(datos[campo])
        
        if not campos_actualizar:
            conn.close()
            return False
        
        valores.append(producto_id)
        query = f"UPDATE productos SET {', '.join(campos_actualizar)} WHERE id = ?"
        
        conn.execute(query, valores)
        conn.commit()
        conn.close()
        
        return True
    
    def eliminar(self, producto_id):
        """Eliminar un producto (soft delete - marcar stock como 0)"""
        conn = self.get_connection()
        conn.execute('UPDATE productos SET stock = 0 WHERE id = ?', (producto_id,))
        conn.commit()
        conn.close()
        
        return True
    
    def actualizar_stock(self, producto_id, cantidad):
        """Actualizar el stock de un producto"""
        conn = self.get_connection()
        conn.execute(
            'UPDATE productos SET stock = stock - ? WHERE id = ?',
            (cantidad, producto_id)
        )
        conn.commit()
        conn.close()
        
        return True
