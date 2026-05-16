import { useState, useEffect } from "react"

const TOAST_REMOVE_DELAY = 4000

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

let memoryState = { toasts: [] }
const listeners = new Set()

function dispatch(action) {
  if (action.type === "ADD_TOAST") {
    memoryState = { toasts: [...memoryState.toasts, action.toast] }
  } else if (action.type === "REMOVE_TOAST") {
    memoryState = { toasts: memoryState.toasts.filter((t) => t.id !== action.id) }
  }
  listeners.forEach((listener) => listener(memoryState))
}

export function useToast() {
  const [state, setState] = useState(memoryState)

  useEffect(() => {
    listeners.add(setState)
    return () => listeners.delete(setState)
  }, [])

  const toast = ({ title, description }) => {
    const id = genId()
    dispatch({
      type: "ADD_TOAST",
      toast: { id, title, description, open: true },
    })
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", id })
    }, TOAST_REMOVE_DELAY)
  }

  const dismiss = (id) => {
    dispatch({ type: "REMOVE_TOAST", id })
  }

  return { toasts: state.toasts, toast, dismiss }
}