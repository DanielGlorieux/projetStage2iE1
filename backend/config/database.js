const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'led_platform',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            acquireTimeout: 60000,
            timeout: 60000,
            reconnect: true,
            charset: 'utf8mb4',
            timezone: '+00:00'
        });

        this.promisePool = this.pool.promise();
        this.testConnection();
    }

    async testConnection() {
        try {
            const connection = await this.promisePool.getConnection();
            console.log('✅ Connexion à MySQL établie avec succès');
            connection.release();
        } catch (error) {
            console.error('❌ Erreur de connexion à MySQL:', error.message);
            process.exit(1);
        }
    }

    async query(sql, params = []) {
        try {
            const [rows] = await this.promisePool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Erreur de requête SQL:', error);
            throw error;
        }
    }

    async transaction(callback) {
        const connection = await this.promisePool.getConnection();
        
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async migrate() {
        try {
            const schemaPath = path.join(__dirname, '../database/schema.sql');
            const schema = fs.readFileSync(schemaPath, 'utf8');
            
            // Diviser le schéma en requêtes individuelles
            const queries = schema.split(';').filter(query => query.trim());
            
            for (const query of queries) {
                if (query.trim()) {
                    await this.query(query);
                }
            }
            
            console.log('✅ Migration de la base de données terminée');
        } catch (error) {
            console.error('❌ Erreur lors de la migration:', error);
            throw error;
        }
    }

    close() {
        this.pool.end();
    }
}

module.exports = new Database();