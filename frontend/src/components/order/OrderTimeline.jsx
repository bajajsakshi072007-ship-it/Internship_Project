import React from 'react'
import { ORDER_STATUS_STEPS } from '../../utils/constants'
import { formatDateTime } from '../../utils/helpers'

const OrderTimeline = ({ statusHistory = [], currentStatus }) => {
  // Get index of current status in the progression
  const currentStepIndex = ORDER_STATUS_STEPS.findIndex(s => s.status === currentStatus)

  const getHistoryForStatus = (status) =>
    statusHistory.find(h => h.status === status)

  return (
    <div className="space-y-0">
      {ORDER_STATUS_STEPS.map((step, idx) => {
        const isCurrent   = step.status === currentStatus
        const isCompleted = currentStepIndex > idx
        const history     = getHistoryForStatus(step.status)

        return (
          <div key={step.status} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div className={`
                w-9 h-9 rounded-full flex items-center justify-center text-base
                transition-all duration-300 ring-2 ring-offset-2
                ${isCompleted ? 'bg-secondary-500 ring-secondary-300 text-white'
                  : isCurrent ? 'bg-primary-500 ring-primary-300 text-white animate-pulse-soft'
                  : 'bg-gray-100 ring-gray-200 text-gray-400'
                }
              `}>
                {step.icon}
              </div>
              {idx < ORDER_STATUS_STEPS.length - 1 && (
                <div className={`w-0.5 h-10 transition-colors duration-300 ${isCompleted ? 'bg-secondary-300' : 'bg-gray-200'}`} />
              )}
            </div>

            {/* Content */}
            <div className="pb-8 pt-1">
              <p className={`font-medium text-sm ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                {step.label}
              </p>
              {history && (
                <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(history.timestamp)}</p>
              )}
              {history?.note && (
                <p className="text-xs text-gray-500 mt-0.5 italic">"{history.note}"</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default OrderTimeline
