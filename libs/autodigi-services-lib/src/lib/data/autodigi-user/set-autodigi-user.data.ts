import { ClientSession } from 'mongoose';
import { AutodigiUserModel } from '../../connections/autodigi-db-repo-repo.connection';

export async function updateAutodigiUserSubscpritionID(userID: string, subscrpitionID: string | null) {
  return new Promise((resolve, reject) => {
    AutodigiUserModel((model) => {
      model
        .updateOne(
          { _id: userID },
          {
            $set: {
              more_commerce_subscription_id: subscrpitionID,
            },
          },
        )
        .exec((err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
    });
  });
}

export async function deleteLinkSubscriptionInAutodigiUser(subscrptionID: string, session: ClientSession) {
  return new Promise((resolve, reject) => {
    AutodigiUserModel((model) => {
      model
        .updateMany(
          { more_commerce_subscription_id: subscrptionID },
          {
            $set: {
              more_commerce_subscription_id: null,
            },
          },
          {
            multi: true,
          },
        )
        .session(session)
        .lean()
        .exec((err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
    });
  });
}
