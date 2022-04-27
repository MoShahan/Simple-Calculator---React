import { useReducer } from 'react';
import './styles.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:

      if (payload.digit === "0" && state.currentOperand === "0") return state
      // payload.digit        === watever we r clicking
      // state.currentOperand === wat is present ryt now

      if (payload.digit === "." && state.currentOperand != null && state.currentOperand.includes(".")) return state
      // if (payload.digit === "." && state.currentOperand == null) return {}

      if (state.overwrite) {
        // after eql to sign == this shd work
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) return state

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null
      }

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) return state
      return {
        ...state,
        operation: null,
        previousOperand: null,
        currentOperand: evaluate(state),
        overwrite: true
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }

      if (state.currentOperand == null) return state

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    // default:
    //   return {}
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      if (current != "0") computation = prev / current
      else computation = prev
      break
  }
  return computation.toString()
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  // dispatch ({ type:ACTIONS.ADD_DIGIT, payload: {digit: 1} })

  return (
    <div>
      {/* <h2>Calculator App</h2> */}
      <div className='calculator-grid'>
        <div className='output'>
          <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div>
        </div>

        <button className='span-two' onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>

        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>

        {/* <button>/</button> */}
        <OperationButton operation="/" dispatch={dispatch} />
        {/* <button>1</button> */}
        <DigitButton digit="1" dispatch={dispatch} />
        {/* <button>2</button> */}
        <DigitButton digit="2" dispatch={dispatch} />
        {/* <button>3</button> */}
        <DigitButton digit="3" dispatch={dispatch} />
        {/* <button>*</button> */}
        <OperationButton operation="*" dispatch={dispatch} />
        {/* <button>4</button> */}
        <DigitButton digit="4" dispatch={dispatch} />
        {/* <button>5</button> */}
        <DigitButton digit="5" dispatch={dispatch} />
        {/* <button>6</button> */}
        <DigitButton digit="6" dispatch={dispatch} />
        {/* <button>+</button> */}
        <OperationButton operation="+" dispatch={dispatch} />
        {/* <button>7</button> */}
        <DigitButton digit="7" dispatch={dispatch} />
        {/* <button>8</button> */}
        <DigitButton digit="8" dispatch={dispatch} />
        {/* <button>9</button> */}
        <DigitButton digit="9" dispatch={dispatch} />
        {/* <button>-</button> */}
        <OperationButton operation="-" dispatch={dispatch} />
        {/* <button>.</button> */}
        <DigitButton digit="." dispatch={dispatch} />
        {/* <button>0</button> */}
        <DigitButton digit="0" dispatch={dispatch} />

        <button className='span-two' onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>

      </div>
    </div>
  )
}

export default App;