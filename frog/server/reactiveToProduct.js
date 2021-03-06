// @flow

import { type activityDataT, type ActivityPackageT } from 'frog-utils';
import { Meteor } from 'meteor/meteor';

import { Activities } from '../imports/api/activities';
import { activityTypesObj } from '../imports/activityTypes';
import { Objects } from '../imports/api/objects';
import { Graphs } from '../imports/api/graphs';
import doGetInstances from '../imports/api/doGetInstances';
import { Products } from '../imports/api/products';
import { serverConnection } from './share-db-manager';

declare var Promise: any;

// given an activity ID, checks the dataStructure for a list of instances, fetches
// the reactive data for each instance, and compiles it into an activityDataT object

const cleanId = id => id.split('/')[1];

const formatResults = (
  plane,
  results,
  formatProduct,
  config,
  initData,
  users,
  object,
  ownerId
) => {
  const format = (data, instance) => {
    let product;
    if (formatProduct) {
      const user = users.find(x => x._id === instance);
      const username = user && user.username;
      try {
        product = formatProduct(
          config,
          data,
          instance,
          username,
          object,
          plane
        );
      } catch (error) {
        console.error(
          'Err: Failed to run formatProduct with reactive data',
          error
        );
        console.error(error);
        try {
          product = formatProduct(
            config,
            initData,
            instance,
            username,
            object,
            plane
          );
        } catch (err) {
          console.error(
            'Err: Failed to run formatProduct with initialData',
            error
          );
          product = {};
        }
      }
    } else {
      product = data;
    }
    return product;
  };

  return results
    .filter(plane > 3 || (x => cleanId(x.id) !== ownerId))
    .reduce((acc, k) => {
      acc[cleanId(k.id)] = { data: format(k.data, cleanId(k.id)) };
      return acc;
    }, {});
};

export const getActivityDataFromReactive = (
  activityId: string
): activityDataT => {
  const activity = Activities.findOne(activityId);
  const graph = Graphs.findOne(activity.graphId);
  const ownerId = graph?.ownerId;
  const aT: ActivityPackageT = activityTypesObj[activity.activityType];
  const object = Objects.findOne(activityId);
  const { structure } = doGetInstances(activity, object);
  const users = Meteor.users.find({}).fetch();
  const initData =
    typeof aT.dataStructure === 'function'
      ? aT.dataStructure(activity.data)
      : aT.dataStructure;

  const promise = new Promise((resolve, reject) => {
    serverConnection.createFetchQuery(
      'rz',
      { _id: { $regex: '^' + activityId } },
      null,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            formatResults(
              activity.plane,
              results,
              aT.formatProduct,
              activity.data,
              initData,
              users,
              object,
              ownerId
            )
          );
        }
      }
    );
  });

  const data = Promise.await(promise);

  const ret: activityDataT = { structure, payload: data };
  return ret;
};

const ensure = (activityId: string) => {
  const product = getActivityDataFromReactive(activityId);
  Products.update(
    activityId,
    {
      $set: {
        activityData: product,
        type: 'product'
      }
    },
    { upsert: true }
  );
  Activities.update(activityId, { $set: { state: 'computed' } });
  return product;
};

Meteor.methods({ 'reactive.to.product': id => ensure(id) });

export default ensure;
