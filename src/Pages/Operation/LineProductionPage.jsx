import { Stack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import CustomStepper from '../../Components/Stepper/CustomStepper'

function LineProductionPage() {

  const [currentStep, setCurrentStep] = useState('')
  const [messageStep, setMessageStep] = useState('')
  const [steps, setSteps] = useState([])
  return (
    <Stack>
      <CustomStepper steps={steps} currentStep={currentStep} message={messageStep} />

      <Text>line product</Text>
    </Stack>
  )
}

export default LineProductionPage