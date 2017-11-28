import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import { uuid } from 'frog-utils';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import { InjectData } from 'meteor/staringatlights:inject-data';
import Stringify from 'json-stringify-pretty-compact';
import fs from 'fs';

import { activityTypesObj, activityTypes } from '/imports/activityTypes';
import { serverConnection } from './share-db-manager';
import { mergeOneInstance } from './mergeData';

Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

Picker.filter(req => req.method === 'POST').route(
  '/lti/:slug',
  (params, request, response, next) => {
    let user;
    try {
      user = request.body.lis_person_name_full;
    } catch (e) {
      user = uuid();
    }
    let id;
    try {
      id = JSON.parse(request.body.lis_result_sourcedid).data.userid;
    } catch (e) {
      id = uuid();
    }

    // eslint-disable-next-line no-console
    const { userId } = Accounts.updateOrCreateUserFromExternalService('frog', {
      id: user
    });
    Meteor.users.update(userId, { $set: { username: user, userid: id } });
    const stampedLoginToken = Accounts._generateStampedLoginToken();
    Accounts._insertLoginToken(userId, stampedLoginToken);
    InjectData.pushData(response, 'login', {
      token: stampedLoginToken.token,
      slug: params.slug
    });
    next();
  }
);

Picker.route('/api/activityTypes', (params, request, response, next) => {
  response.end(
    Stringify(
      activityTypes.map(x => ({
        id: x.id,
        type: x.type,
        name: x.meta.name,
        description: x.meta.shortDesc,
        longDescription: x.meta.description
      }))
    )
  );
});

const safeDecode = (json, msg, response) => {
  if (!json) {
    return undefined;
  }
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error(e);
    return response.end(msg);
  }
};

const InstanceDone = {};
Picker.route(
  '/api/activityType/:activityTypeId',
  ({ activityTypeId, query }, request, response, next) => {
    if (!activityTypesObj[activityTypeId]) {
      response.end('No matching activity type found');
    }
    const activityData = safeDecode(
      query.activityData,
      'Activity data not valid',
      response
    );
    const config = safeDecode(query.config, 'Config data not valid', response);

    const docId = [
      query.client_id,
      activityTypeId,
      query.activity_id || 'default',
      query.instance_id
    ].join('/');
    if (!InstanceDone[docId]) {
      InstanceDone[docId] = true;
      if (query.activity_data) {
        try {
          return JSON.parse(query.activity_data);
        } catch (e) {
          return response.end('Activity data malformed');
        }
      }
      const aT = activityTypesObj[activityTypeId];
      Promise.await(
        new Promise(resolve => {
          const doc = serverConnection.get('rz', docId);
          doc.fetch();
          if (doc.type) {
            resolve();
          }
          doc.once(
            'load',
            Meteor.bindEnvironment(() => {
              if (doc.type) {
                resolve();
              } else {
                mergeOneInstance(
                  null,
                  null,
                  aT.dataStructure,
                  aT.mergeFunction,
                  null,
                  null,
                  null,
                  { data: activityData, config: config || {} },
                  docId
                );
                resolve();
              }
            })
          );
        })
      );
    }
    InjectData.pushData(response, 'api', {
      activityType: activityTypeId,
      instance_id: docId,
      activity_data: activityData,
      config: config
    });
    next();
  }
);

if (process.env.NODE_ENV !== 'production') {
  WebApp.connectHandlers.use('/file', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'PUT');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
    } else if (req.method === 'PUT') {
      req.pipe(fs.createWriteStream('/tmp/' + req.query.name));
      res.writeHead(200);
      res.end();
    } else if (req.method === 'GET') {
      const fname = req.query.name && '/tmp/' + req.query.name.split('?')[0];
      fs.access(fname, err => {
        if (err) {
          res.writeHead(404);
          res.end();
        } else {
          res.writeHead(200);
          const readStream = fs.createReadStream(fname);
          readStream.once('open', () => readStream.pipe(res));
        }
      });
    }
  });
}
