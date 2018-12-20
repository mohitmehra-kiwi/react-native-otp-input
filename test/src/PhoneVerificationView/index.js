import React, { Component } from 'react'
import { View, TextInput } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

export default class PhoneVerificationView extends Component {
    static propTypes = {
        pinCount: PropTypes.number,
        codeInputFieldStyle: PropTypes.object,
        codeInputHighlightStyle: PropTypes.object,
        onCodeFilled: PropTypes.func,
        code: PropTypes.string, 
    }

    static defaultProps = {
        pinCount: 6,
        codeInputFieldStyle: null,
        codeInputHighlightStyle: null,
        onCodeFilled: null,
        code: "",
    }

    state = {
        digits: [],
        selectedIndex: 0,
    }

    fields = []

    componentDidMount() {
        this.fields[0].focus && this.fields[0].focus()
        this.setState({
            digits: this.props.code.split(""),
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.code !== this.state.digits) {
            this.setState({
                digits: nextProps.code.split(""),
            })
        }
    }

    render() {
        return (
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', height: '100%' }, this.props.style]}>
                {this._renderTextFields()}
            </View>
        );
    }

    _renderOneInputField = (index) => {
        const {codeInputFieldStyle, codeInputHighlightStyle} = this.props
        const {defaultTextFieldStyle} = styles
        return (
            <TextInput
                underlineColorAndroid='rgba(0,0,0,0)'
                style={this.state.selectedIndex === index ? [defaultTextFieldStyle, codeInputFieldStyle, codeInputHighlightStyle] : [defaultTextFieldStyle, codeInputFieldStyle]}
                ref={ref => { this.fields[index] = ref }}
                onChangeText={text => {
                    this._onChangeText(index, text)
                }}
                onKeyPress={({ nativeEvent: { key } }) => { this._onKeyPress(index, key) }}
                value={this.state.digits[index]}
                keyboardType="number-pad"
                key={index}
            />
        )
    }

    _renderTextFields = () => {
        let array = new Array()
        for (i = 0; i<this.props.pinCount; i++) {
            array[i] = i
        }
        return array.map(this._renderOneInputField)
    }


    _onChangeText = (index, text) => {
        const {onCodeFilled} = this.props
        if (index === this.props.pinCount - 1) { 
            const newdigits = this.state.digits.slice()
            newdigits[index] = text.split("").pop()
            this.setState({ digits: newdigits })
            let result = newdigits.join("")
            if (result.length >= this.props.pinCount) {
                onCodeFilled && onCodeFilled(result)
            }
        } else {
            const newdigits = this.state.digits.slice()
            newdigits[index] = text.split("").pop()
            this.setState({ digits: newdigits })
            if (text.length > 0 && index < this.props.pinCount - 1) {
                this._focusField(index + 1)
            }
        }
    }

    _onKeyPress = (index, key) => {
        if(key === 'Backspace') {
            if (!this.state.digits[index] && index > 0) {
                this._onChangeText(index - 1, '')
                this._focusField(index - 1)
            }
        }
    }

    _focusField = (index) => {
        this.fields[index].focus()
        this.setState({
            selectedIndex: index
        })
    }
}