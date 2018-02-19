/* eslint-disable func-names */
import { Meteor } from 'meteor/meteor';

import {
  Activities,
  Operators,
  Connections
} from '../imports/api/activities.js';
import { Graphs } from '../imports/api/graphs.js';
import { Sessions } from '../imports/api/sessions.js';
import { ActivityData } from '../imports/api/activityData.js';
import { Products } from '../imports/api/products.js';
import { Objects } from '../imports/api/objects.js';
import { ActivityLibrary } from '../imports/api/activityLibrary.js';

const teacherPublish = (publish, collection, only) =>
  Meteor.publish(publish, function() {
    if (
      this.userId &&
      Meteor.users.findOne(this.userId).username === 'teacher'
    ) {
      return only ? collection.find({}, only) : collection.find({});
    } else {
      return this.ready();
    }
  });

export default () => {
  teacherPublish('activities', Activities);
  teacherPublish('users', Meteor.users, { fields: { username: 1 } });
  teacherPublish('operators', Operators);
  teacherPublish('connections', Connections);
  teacherPublish('activity_data', ActivityData);
  teacherPublish('graphs', Graphs);
  teacherPublish('objects', Objects);
  teacherPublish('products', Products);
  teacherPublish('sessions', Sessions);
  teacherPublish('activity_library', ActivityLibrary);
};
