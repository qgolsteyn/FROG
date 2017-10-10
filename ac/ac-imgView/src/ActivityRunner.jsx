// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Mousetrap from 'mousetrap';
import type { ActivityRunnerT } from 'frog-utils';

import ThumbList from './components/ThumbList';
import TopBar from './components/TopBar';
import UploadBar from './components/UploadBar';
import ZoomView from './components/ZoomView';
import WebcamInterface from './components/WebcamInterface';

const Main = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

class ActivityRunner extends Component {
  state: {
    zoomOn: boolean,
    index: number,
    category: string,
    webcamOn: boolean
  };

  categories: {
    [categoryName: string]: string[]
  };
  textBinding: any;
  textRef: any;

  constructor(props: ActivityRunnerT) {
    super(props);
    Mousetrap.bind('esc', () => this.setState({ zoomOn: false }));

    const { data } = props;
    this.categories = Object.keys(data).reduce(
      (acc, key) => ({
        ...acc,
        all: [...(acc.all || []), data[key].url],
        ...(data[key].categories &&
          data[key].categories.reduce(
            (_acc, cat) => ({
              ..._acc,
              [cat]: [...(acc[cat] || []), data[key].url]
            }),
            {}
          ))
      }),
      {}
    );

    const startingCategory =
      Object.keys(this.categories).length > 1 ? 'categories' : 'all';

    this.state = {
      zoomOn: false,
      index: 0,
      category: startingCategory,
      webcamOn: false
    };
  }

  componentDidMount() {
    this.props.dataFn.bindText(this.textRef, 'text');
  }

  componentWillUnmount() {
    this.textBinding.destroy();
    Mousetrap.unbind('esc');
  }

  render() {
    const { activityData, data, dataFn, userInfo, logger } = this.props;

    const minVoteT = activityData.config.minVote || 1;

    const images = Object.keys(data)
      .filter(
        key =>
          data[key] !== undefined &&
          data[key].url !== undefined &&
          (this.state.category === 'all' ||
            (data[key].categories !== undefined &&
              data[key].categories.includes(this.state.category)))
      )
      .map(key => ({ ...data[key], key }));

    const vote = (key, userId) => {
      logger('vote/' + key);
      const prev = data[key].votes ? data[key].votes[userId] : false;
      dataFn.objInsert(!prev, [key, 'votes', userId]);
      if (this.props.stream) {
        this.props.stream.objInsert(!prev, [key, 'votes', userId]);
      }
    };

    const setCategory = (c: string) => this.setState({ category: c });
    const setZoom = (z: boolean) => this.setState({ zoomOn: z });
    const setIndex = (i: number) => this.setState({ index: i });
    const setWebcam = (w: boolean) => this.setState({ webcamOn: w });

    return (
      <Main>
        <TopBar
          categories={[...Object.keys(this.categories), 'categories']}
          category={this.state.category}
          canVote={activityData.config.canVote}
          {...{ setCategory, setZoom }}
        />
        {images.length === 0 && this.state.category !== 'categories'
          ? <h1>
              Please upload images by dropping files on the button below, or
              click the button to turn on the webcam
            </h1>
          : <ThumbList
              {...{
                images,
                categories: this.categories,
                minVoteT,
                vote,
                userInfo,
                setCategory,
                setZoom,
                setIndex,
                logger
              }}
              canVote={activityData.config.canVote}
              showingCategories={this.state.category === 'categories'}
            />}
        <textarea ref={ref => (this.textRef = ref)} />
        {this.state.category !== 'categories' &&
          this.state.zoomOn &&
          <ZoomView
            index={this.state.index}
            {...{ close: () => setZoom(false), images, setIndex }}
          />}
        {activityData.config.canUpload &&
          <UploadBar {...{ ...this.props, setWebcam }} />}
        {this.state.webcamOn &&
          <WebcamInterface {...{ ...this.props, setWebcam }} />}
      </Main>
    );
  }
}

ActivityRunner.displayName = 'ActivityRunner';
export default (props: ActivityRunnerT) => <ActivityRunner {...props} />;
