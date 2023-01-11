// @flow

import { Box, Image, Stack } from '@chakra-ui/react';
import React, {type Node, Component} from 'react';

type Slide = {
  index: number,
  style?: any,
  width?: number,
  item?: any,
};

type PropsType = {
  images: string[],
  style?: any,
  loop?: boolean,
  loopBothSides?: boolean,
  autoPlayWithInterval?: number,
  position?: number,
  onPositionChanged?: (number) => void,
  onClick?: (Object) => void,
  customButtons?: (number, (number, animated?: boolean) => void) => Node,
  customSlide?: (Slide) => Node,
};

type StateType = {
  position: number,
  width: number,
  interval: any,
  onPositionChangedCalled: boolean,
};

class ImageSlider extends Component<PropsType, StateType> {
  state = {
    position: 0,
    width: '100%',
    onPositionChangedCalled: false,
    interval: null,
  };

  _ref = null;
  _panResponder = {};

  _onRef = (ref: any) => {
    this._ref = ref;
    if (ref && this.state.position !== this._getPosition()) {
      this._move(this._getPosition());
    }
  };

  // In iOS you can pop view by swiping left, with active ScrollView
  // you can't do that. This View on top of ScrollView enables call of
  // pop function.
  _popHelperView = () =>
    !this.props.loopBothSides &&
    this._getPosition() === 0 && (
      <Stack style={{position: 'absolute', width: 50, height: '100%'}} />
    );

  _move = (index: number, animated: boolean = true) => {
    const isUpdating = index !== this._getPosition();
    const x = window.innerWidth * index;

    this._ref && this._ref.scrollTo({y: 0, x, animated});

    this.setState({position: index});

    if (
      isUpdating &&
      this.props.onPositionChanged &&
      index < this.props.images.length &&
      index > -1
    ) {
      this.props.onPositionChanged(index);
      this.setState({onPositionChangedCalled: true});
    }

    this._setInterval();
  };

  _getPosition() {
    if (typeof this.props.position === 'number') {
      return this.props.position;
    }
    return this.state.position;
  }

  componentDidUpdate(prevProps: Object) {
    const {position} = this.props;

    if (position && prevProps.position !== position) {
      this._move(position);
    }
  }

  _clearInterval = () =>
    this.state.interval && clearInterval(this.state.interval);

  _setInterval = () => {
    this._clearInterval();
    const {autoPlayWithInterval, images, loop, loopBothSides} = this.props;

    if (autoPlayWithInterval) {
      this.setState({
        interval: setInterval(
          () =>
            this._move(
              !(loop || loopBothSides) &&
                this.state.position === images.length - 1
                ? 0
                : this.state.position + 1,
            ),
          autoPlayWithInterval,
        ),
      });
    }
  };

  _handleScroll = (event: Object) => {
    const {position, width} = this.state;
    const {loop, loopBothSides, images, onPositionChanged} = this.props;
    const {x} = event.nativeEvent.contentOffset;

    if (
      (loop || loopBothSides) &&
      x.toFixed() >= +(width * images.length).toFixed()
    ) {
      return this._move(0, false);
    } else if (loopBothSides && x.toFixed() <= +(-width).toFixed()) {
      return this._move(images.length - 1, false);
    }

    let newPosition = 0;

    if (position !== -1 && position !== images.length) {
      newPosition = Math.round(event.nativeEvent.contentOffset.x / width);
      this.setState({position: newPosition});
    }

    if (
      onPositionChanged &&
      !this.state.onPositionChangedCalled &&
      newPosition < images.length &&
      newPosition > -1
    ) {
      onPositionChanged(newPosition);
    } else {
      this.setState({onPositionChangedCalled: false});
    }

    this._setInterval();
  };

  componentDidMount() {
    this._setInterval();
  }

  componentWillUnmount() {
    this._clearInterval();
  }

  _onLayout = () => {
    this.setState({width: window.innerWidth});
    this._move(this.state.position, false);
  };

  _renderImage = (image: any, index: number) => {
    const {width} =window.innerWidth;
    const {onClick, customSlide} = this.props;
    const offset = {marginLeft: index === -1 ? -width : 0};
    const imageStyle = [styles.image, {width}, offset];

    if (customSlide) {
      return customSlide({item: image, style: imageStyle, index, width});
    }

    const imageObject = typeof image === 'string' ? {uri: image} : image;

    const imageComponent = (
      <Image
        key={index}
        src={imageObject}
        // resizeMode={this.props.resizeMode}
        style={[imageStyle]}
      />
    );

    if (onClick) {
      return (
        <Stack
          key={index}
          style={[imageStyle, offset]}
          onClick={() => onClick && onClick({image, index})}
          delayPressIn={200}>
          {imageComponent}
        </Stack>
      );
    }

    return imageComponent;
  };

  // We make shure, that, when loop is active,
  // fake images at the begin and at the end of ScrollView
  // do not scroll.
  _scrollEnabled = (position: number) =>
    position !== -1 && position !== this.props.images.length;

  handleSlide = (direction) => {
    const {position} = this.state;
    const {images} = this.props;

    if (direction == 'right') {
      if (position + 1 <= images.length - 1) {
        this._move(position + 1, true);
      }
    }
    if (direction == 'left') {
      if (position !== 0) {
        this._move(position - 1, true);
      }
    }
  };

  render() {
    const {style, loop, images, loopBothSides} = this.props;
    const position = this._getPosition();
    const scrollEnabled = this._scrollEnabled(position);

    let renderSliderLeft = () => {
      return (
        <Stack
          style={{
            position: 'absolute',
            left: 0,
            backgroundColor: 'transparent',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Stack
            style={{
              backgroundColor: 'hsla(0,0%,4%,.5)',
              padding: 10,
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3,
            }}
            onClick={() => this.handleSlide('left')}>
            <Image
              style={{width: 25, height: 25}}
              src={require('../../assets/icons/slide-left.png')}
              // source={require('../../../assets/icons/slide-left.png')}
            />
          </Stack>
        </Stack>
      );
    };

    let renderSliderRight = () => {
      return (
        <Stack
          style={{
            position: 'absolute',
            right: 0,
            backgroundColor: 'transparent',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Stack
            style={{
              backgroundColor: 'hsla(0,0%,4%,.5)',
              padding: 10,
              borderTopLeftRadius: 3,
              borderBottomLeftRadius: 3,
            }}
            onClick={() => this.handleSlide('right')}>
            <Image
              style={{width: 25, height: 25}}
              src={require('../../assets/icons/slide-right.png')}
            />
          </Stack>
        </Stack>
      );
    };

    return (
      <Stack style={[styles.container, style]} onLayout={this._onLayout}>
        <Box
          onLayout={this._onLayout}
          ref={(ref) => this._onRef(ref)}
          onMomentumScrollEnd={this._handleScroll}
          scrollEventThrottle={16}
          pagingEnabled={true}
          bounces={loopBothSides}
          contentInset={loopBothSides ? {left: this.state.width} : {}}
          horizontal={true}
          scrollEnabled={scrollEnabled}
          showsHorizontalScrollIndicator={false}
          style={[styles.scrollViewContainer, style]}>
          {loopBothSides && this._renderImage(images[images.length - 1], -1)}
          {images.map(this._renderImage)}
          {(loop || loopBothSides) &&
            this._renderImage(images[0], images.length)}
        </Box>
        {renderSliderLeft()}
        {renderSliderRight()}

        {this._popHelperView()}
      </Stack>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flexDirection: 'row',
    backgroundColor: '#222',
  },
  image: {
    width: 200,
    height: '100%',
  },
  buttons: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: 15,
    // right: 0,
    width: '100%',
    bottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: 3,
    width: 5,
    height: 5,
    borderRadius: 5 / 2,
    backgroundColor: '#ccc',
    opacity: 0.9,
  },
  buttonSelected: {
    opacity: 1,
    backgroundColor: '#41e9fc',
  },
});

export default ImageSlider;
