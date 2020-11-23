//This is where we will define our Mongoose User Model
import mongoose from 'mongoose';
import {Password} from '../services/password';

//An interfce that describes the properties that are required to create a new user
interface UserAttrs{
  email: string;
  password: string;
}

//An interface that describes the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//an interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document{
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

//Using asnc with mongoose, we add await and at the end we call done()
userSchema.pre('save', async function(done){
  //We only want to hash the password if the password was changed 
  //otherwise it will be hashed again which we do not want
  if(this.isModified('password')){
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

//Add a custom function to our model in Mongoose
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

//Will be called instead of User() so TS checking will work on the arguments
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

const user = User.build({email: 'test@test.com', password: 'testP'})

export {User};