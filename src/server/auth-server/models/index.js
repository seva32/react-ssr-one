import mongoose from 'mongoose';
// import User from './user';
// import Role from './role';
// import ThirdPartyProviderSchema from './thirdPartyProviderSchema';

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require('./user').default;
db.role = require('./role').default;
db.thirdPartyProviderSchema = require('./thirdPartyProviderSchema').default;

db.ROLES = ['user', 'admin', 'moderator'];

export default db;
