// @flow

import * as React from 'react';
import { DocHead } from 'meteor/kadira:dochead';
import { uuid } from 'frog-utils';

import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import { createLogger } from '/imports/api/logs';
import { LocalSettings } from '/imports/api/settings';
import LearningItem from '/imports/client/LearningItem';
import DashMultiWrapper from '../Dashboard/MultiWrapper';
import { RunActivity } from '../StudentView/Runner';
import ApiForm from '../GraphEditor/SidePanel/ApiForm';
import { connection } from './connection';
import LIDashboard from '../Dashboard/LIDashboard';

export default ({ data }: { data: Object }) => {
  LocalSettings.api = true;
  if (data.callType === 'learningItem') {
    const doc = connection.get('li', uuid());
    const dataFn = generateReactiveFn(doc, LearningItem);
    const LI = dataFn.LearningItem;
    return (
      <div style={{ margin: '20px' }}>
        {data.type === 'dashboard' ? (
          <LIDashboard id={data.learningItem} />
        ) : (
          <LI id={data.learningItem} type={data.type} />
        )}
      </div>
    );
  }
  if (data.callType === 'dashboard') {
    return (
      <DashMultiWrapper
        activity={{
          _id: data.activityId,
          activityType: data.activityType,
          data: data.config,
          length: 900,
          startTime: 0
        }}
        users={{}}
        config={data.config}
        object={{
          activityData: {
            structure: 'all',
            payload: { all: { data: {}, config: {} } }
          },
          socialStructure: {},
          globalStructure: { students: {}, studentIds: [] }
        }}
        instances={[]}
        ready
      />
    );
  }
  if (data.callType === 'config') {
    if (data.injectCSS) {
      DocHead.addLink({
        rel: 'stylesheet',
        type: 'text/css',
        href: data.injectCSS
      });
    }
    return (
      <ApiForm
        whiteList={data.whiteList}
        activityType={data.activityType}
        config={data.config}
        hidePreview
        noOffset
        hideValidator={!data.showValidator}
        hideLibrary={!data.showLibrary}
        showDelete={data.showDelete}
      />
    );
  } else {
    const logger = createLogger(
      'headless/' + data.clientId,
      data.instanceId,
      {
        _id: data.activityId,
        activityType: data.activityType
      },
      data.userId || 'anonymous'
    );
    const activityData = {
      data: data.activityData,
      config: data.config || {}
    };
    const apilogger = data.readOnly
      ? () => {}
      : msg => {
          logger(msg);
          const logs = Array.isArray(msg) ? msg : [msg];
          logs.forEach(log => {
            window.parent.postMessage(
              {
                type: 'frog-log',
                msg: {
                  id: uuid(),
                  activityType: data.activityType,
                  username: data.userName,
                  userid: data.userId,
                  timestamp: new Date(),
                  ...log
                }
              },
              '*'
            );
          });
        };
    return (
      <RunActivity
        logger={apilogger}
        readOnly={data.readOnly}
        activityTypeId={data.activityType}
        username={data.userName || 'Anonymous'}
        userid={data.userId || '1'}
        stream={() => {}}
        reactiveId={data.instanceId}
        groupingValue={data.instanceId}
        activityData={activityData}
        rawData={data.rawData}
        sessionId={data.activityId}
        activityId={data.activityId}
        instanceMembers={[]}
        groupingKey="group"
      />
    );
  }
};
