import mongoose from 'mongoose';

const connections = {};

export const getTenantDB = (fioId) => {
  const dbName = `admin${fioId}`;
  if (connections[dbName]) return connections[dbName];

  const uri = `${process.env.MONGODB_URI_BASE}/${dbName}`;
  const conn = mongoose.createConnection(uri);

  connections[dbName] = conn;
  return conn;
};





