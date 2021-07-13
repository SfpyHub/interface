import { createAction } from '@reduxjs/toolkit'
import { ApiState, Metadata } from '../../api'
import { EventTypeProps } from '../../order'

export const setEvents = createAction<{events: EventTypeProps[]}>('events/setEvents')
export const setApiState = createAction<{ apistate: ApiState }>('events/setApiState')