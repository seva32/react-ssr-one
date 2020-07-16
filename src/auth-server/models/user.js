/* eslint-disable consistent-return */
/* eslint-disable func-names */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

// define model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});
// on save hook ecrypt pass
userSchema.pre('save', function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});
// crear un method para comparar pass
userSchema.methods.comparePassword = function (candidatePass, cb) {
  // if candidatePass type is number error
  bcrypt.compare(candidatePass.toString(), this.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

// create model class
const ModelClass = mongoose.model('user', userSchema);

// export model
export default ModelClass;
