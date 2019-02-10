import React from "react"
import "./style.css"

class App extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			sessionLength: 25,
			breakLength: 5,
			minutes: 25,
			seconds: '00',
			countingdown: 'no',
			timer: 'Session'
	}

	this.increaseSession = this.increaseSession.bind(this)
	this.decreaseSession = this.decreaseSession.bind(this)
	this.increaseBreak = this.increaseBreak.bind(this)
	this.decreaseBreak = this.decreaseBreak.bind(this)
	this.toggleCount = this.toggleCount.bind(this)
	this.resetCount = this.resetCount.bind(this)
	this.tick = this.tick.bind(this)
	this.startCountDown = this.startCountDown.bind(this)
	this.timerControl = this.timerControl.bind(this)
	}
	increaseSession() {
		this.state.sessionLength < 60 && this.setState(prevState => ({
			sessionLength: prevState.sessionLength + 1
		}))
	}
	decreaseSession() {
		this.state.sessionLength > 1 && this.setState(prevState => ({
			sessionLength: prevState.sessionLength - 1
		}))
	}
	increaseBreak() {
		this.state.breakLength < 60 && this.setState(prevState => ({
			breakLength: prevState.breakLength + 1
		}))
	}
    decreaseBreak() {
		this.state.breakLength > 1 && this.setState(prevState => ({
			breakLength: prevState.breakLength - 1
		}))
	}
	toggleCount() {
		if (this.state.countingdown === "no") {
			this.startCountDown()
			this.setState({countingdown: "yes"})
		} else if (this.state.countingdown === "yes"){
			this.setState({countingdown: "no"})
			clearInterval(this.intervalHandle) //not an actual pause button
		}
	}
	resetCount() {
		clearInterval(this.intervalHandle)
		this.setState({
			sessionLength: 25,
			breakLength: 5,
			timer: 'Session',
			minutes: '00',
			seconds: '00'
		})
	}

	tick() {
		let min = Math.floor(this.secondsRemaining / 60)
		let sec = this.secondsRemaining - (min * 60)
		this.setState({
			minutes: min,
			seconds: sec
		})
		if (sec < 10) {
			this.setState({ seconds: '0' + this.state.seconds })
		}
		if (min < 10) {
			this.setState({ minutes: '0' + this.state.minutes })
		}
		if (min === 0 && sec === 0) {
			console.log("We've hit zero")
			this.audio.play()
            this.audio.currentTime = 0
			this.timerControl()
		}
		this.secondsRemaining--

	}
	startCountDown() {
		let timerLength
		this.intervalHandle = setInterval(this.tick, 1000)
		if (this.state.timer === 'Session') {
			timerLength = this.state.sessionLength
		} else if (this.state.timer === 'Break') {
			timerLength = this.state.breakLength
		}
		this.secondsRemaining = timerLength * 60
	}

	timerControl() {
		clearInterval(this.intervalHandle)
		if (this.state.timer === 'Session') {
			this.setState({ timer: 'Break' })
		} else if (this.state.timer === 'Break') {
			this.setState({ timer: 'Session' })
		}
		this.startCountDown()
	}

  render() {
	return (
	  	<div>
			<div id="session">
				<h2 id="session-label">Session Time:</h2>
				<DecreaseSession
					sessionLength={this.state.sessionLength}
					decreaseSession={this.decreaseSession} />
				<h2 id="session-length">{this.state.sessionLength}</h2>
				<IncreaseSession
					sessionLength={this.state.sessionLength}
					increaseSession={this.increaseSession} />
			</div>
			<div id="break">
				<h2 id="break-label">Break Time:</h2>
				<DecreaseBreak
					breakLength={this.state.breakLength}
					decreaseBreak={this.decreaseBreak} />
				<h2 id="break-length">{this.state.breakLength}</h2>
				<IncreaseBreak
					breakLength={this.state.breakLength}
					increaseBreak={this.increaseBreak} />
			</div>
			<ClockDisplay
				seconds={this.state.seconds}
				minutes={this.state.minutes}
				countingdown={this.state.countingdown}
				startCountDown={this.startCountDown}
				timer={this.state.timer} />
			<div id="clock-buttons">
				<StartPauseButton
					sessionLength={this.state.sessionLength}
					breakLength={this.state.breakLength}
					countingdown={this.state.countingdown} toggleCount={this.toggleCount}/>
				<ResetButton
					sessionLength={this.state.sessionLength}
					breakLength={this.state.breakLength}
					resetCount={this.resetCount} />
			</div>
			<audio
				ref={ref => this.audio = ref}
				id="beep"
				src="https://s3.amazonaws.com/freecodecamp/simonSound1.mp3" >
			</audio>
	  	</div>
	)

  }
}

class IncreaseSession extends React.Component {
	constructor(props){
	super(props)
	this.handleClick = this.handleClick.bind(this)
	}
	handleClick() { this.props.increaseSession() }
	render() {
		return (
			<div>
				<button
					id="session-increment"
					className="btn btn-danger"
					onClick={this.handleClick}>+
				</button>
			</div>
		)
	}
}

class DecreaseSession extends React.Component {
	constructor(props){
	super(props)
	this.handleClick = this.handleClick.bind(this)
	}
	handleClick() { this.props.decreaseSession() }
	render() {
		return (
			<div>
				<button
					id="session-decrement"
					className="btn btn-danger"
					onClick={this.handleClick}>-
				</button>
			</div>
		)
	}
}

class IncreaseBreak extends React.Component {
	constructor(props){
	super(props)
	this.handleClick = this.handleClick.bind(this)
	}
	handleClick() { this.props.increaseBreak() }
	render() {
		return (
			<div>
				<button
					id="break-increment"
					className="btn btn-danger"
					onClick={this.handleClick}>+
				</button>
	  		</div>
		)
	}
}

class DecreaseBreak extends React.Component {
	constructor(props){
	super(props)
	this.handleClick = this.handleClick.bind(this)
	}
	handleClick() { this.props.decreaseBreak() }
	render() {
		return (
			<div>
				<button
					id="break-decrement"
					className="btn btn-danger"
					onClick={this.handleClick}>-
				</button>
			</div>
		)
	}
}

class StartPauseButton extends React.Component {
	constructor(props) {
	super(props)
		this.handleClick = this.handleClick.bind(this)
	}
	componentDidMount() {
		window.focus()
	}
	componentWillUnMount() {
	}
	handleClick() { this.props.toggleCount() }
	render() {
		return (
			<div>
				<button
					id="start_stop"
					className="btn btn-dark"
					onClick={this.handleClick}
					countingdown={this.props.countingdown}>
					Start/Pause
				</button>
			</div>
		)
	}
}

class ResetButton extends React.Component {
	constructor(props) {
	super(props)
		this.handleResetClick = this.handleResetClick.bind(this)
	}
	handleResetClick() { this.props.resetCount() }
	render() {
		return (
			<div>
				<button
					id="reset"
					className="btn btn-dark"
					onClick={this.handleResetClick}>
					Reset
				</button>
			</div>
		)
	}
}

class ClockDisplay extends React.Component {
	render(){
		return (
			<div>
				<h1 id="timer-label">
					{this.props.timer}
				</h1>
				<h1 id="time-left">
					{this.props.minutes}:{this.props.seconds}
				</h1>
			</div>
		)
	}
}

export default App
