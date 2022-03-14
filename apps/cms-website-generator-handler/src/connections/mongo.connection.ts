import * as mongoose from 'mongoose';
export const connect = async (mongoDB_URI: string): Promise<typeof mongoose> => {
  const uri = mongoDB_URI;
  const databaseConnector = await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  mongoose.connection.on('error', (err) => console.log('MongoDb connection error:', err));
  return databaseConnector;
};

export const connectAutodigiMongo = async (mongoDB_URI: string): Promise<mongoose.Connection> => {
  try {
    const mongoOptions = {
      poolSize: 20,
      autoIndex: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    };
    const uri = mongoDB_URI;
    const db = mongoose.createConnection(uri, mongoOptions);
    db.on('error', (err) => {
      console.log('DBERROR:' + err);
    });
    return db as mongoose.Connection & Promise<mongoose.Connection>;
  } catch (ex) {
    console.log('ex [LOG]:--> ', ex);
  }
};
