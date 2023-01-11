import { Stack } from '@chakra-ui/react'
import React, {Component} from 'react'
import ImageSlider from './CustomeSlider'

const screenWidth = window.innerWidth

export default class Common_ImageSlider extends Component {
  constructor(props) {
    super(props)
    this.images = []
    this.autoPlayWithInterval = 5000
  }

  _init() {
    if (
      this.props.images != undefined &&
      JSON.stringify(this.props.images) != JSON.stringify(this.images)
    ) {
      this.images = this.props.images
    }
    if (
      this.props.autoPlayWithInterval != undefined &&
      this.props.autoPlayWithInterval != this.autoPlayWithInterval
    ) {
      this.autoPlayWithInterval = this.props.autoPlayWithInterval
    }
  }

  render() {
    this._init()
    if (this.images.length == 0) {
      return <Stack />
    }

    return (
      <Stack
        style={[
          {width: screenWidth, height: screenWidth * 0.36},
          this.props.style,
        ]}>
        <ImageSlider
          {...this.props}
          images={this.images}
          autoPlayWithInterval={4000}
        //   resizeMode={'contain'}
        />
      </Stack>
    )
  }
}
