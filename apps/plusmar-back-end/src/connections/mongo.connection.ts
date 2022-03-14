import * as mongoose from 'mongoose';
export const connect = async (mongoDB_URI: string): Promise<void> => {
  const uri = mongoDB_URI;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  mongoose.connection.on('error', (err) => console.log('MongoDb connection error:', err));
};
