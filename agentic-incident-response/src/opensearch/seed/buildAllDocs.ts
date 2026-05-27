import type { IncidentDoc } from '../../types.js'
import { extraIncidentsA } from './extraIncidentsA.js'
import { extraIncidentsB } from './extraIncidentsB.js'
import { patternCpuMondayDocs } from './patternCpuMonday.js'
import { patternCpuWednesdayDoc } from './patternCpuWednesday.js'
import { patternLatencyBusinessDoc } from './patternLatencyBusiness.js'
import { patternLatencyMidnightDocs } from './patternLatencyMidnight.js'
import { patternRdsDocs } from './patternRds.js'

export function buildAllIncidentDocs(): IncidentDoc[] {
  return [
    ...patternCpuMondayDocs(),
    ...patternLatencyMidnightDocs(),
    patternCpuWednesdayDoc(),
    patternLatencyBusinessDoc(),
    ...patternRdsDocs(),
    ...extraIncidentsA(),
    ...extraIncidentsB(),
  ]
}
