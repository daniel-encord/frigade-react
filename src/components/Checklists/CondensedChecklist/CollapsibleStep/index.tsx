import React, { FC } from 'react'
import { Appearance, StepData } from '../../../../types'
import { CheckBoxRow } from '../../../CheckBoxRow'
import { Chevron } from '../../../Icons/Chevron'
import { Button, MultipleButtonContainer } from '../../../Button'
import { AnimatePresence, motion } from 'framer-motion'

import {
  CollapseChevronContainer,
  HeaderLeft,
  StepContainer,
  StepHeader,
  StepImage,
  StepMediaContainer,
  StepSubtitle,
  StepTitle,
} from './styled'
import { sanitize } from '../../../../shared/sanitizer'
import { getClassName } from '../../../../shared/appearance'
import { VideoCard } from '../../../Video/VideoCard'

interface CollapsibleStepProps {
  stepData: StepData
  collapsed: boolean
  onClick: () => void
  onSecondaryButtonClick: () => void
  onPrimaryButtonClick: () => void
  appearance?: Appearance
  // Map from string to function with StepData returning React.ReactNode
  customStepTypes?: Record<string, (stepData: StepData, appearance: Appearance) => React.ReactNode>
}

export const CollapsibleStep: FC<CollapsibleStepProps> = ({
  stepData,
  collapsed,
  onClick,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  appearance,
  customStepTypes,
}) => {
  const iconStyle = collapsed ? {} : { transform: 'rotate(90deg)' }

  function getDefaultStepContent() {
    return (
      <>
        {stepData.imageUri || stepData.videoUri ? (
          <StepMediaContainer className={getClassName('stepMediaContainer', appearance)}>
            {stepData.imageUri ? (
              <StepImage
                className={getClassName('stepImage', appearance)}
                src={stepData.imageUri}
                style={stepData.imageStyle}
              />
            ) : null}
            {stepData.videoUri ? (
              <VideoCard appearance={appearance} videoUri={stepData.videoUri} />
            ) : null}
          </StepMediaContainer>
        ) : null}
        <StepSubtitle
          className={getClassName('stepSubtitle', appearance)}
          appearance={appearance}
          dangerouslySetInnerHTML={sanitize(stepData.subtitle)}
        />
        <MultipleButtonContainer className={getClassName('checklistCTAContainer', appearance)}>
          {stepData.secondaryButtonTitle ? (
            <Button
              secondary
              title={stepData.secondaryButtonTitle}
              onClick={() => onSecondaryButtonClick()}
              appearance={appearance}
            />
          ) : null}
          <Button
            title={stepData.primaryButtonTitle ?? 'Continue'}
            onClick={() => onPrimaryButtonClick()}
            appearance={appearance}
          />
        </MultipleButtonContainer>
      </>
    )
  }

  function getCustomStep() {
    if (!customStepTypes) {
      return null
    }
    const customStep = customStepTypes[stepData.type]
    if (!customStep) {
      return null
    }
    return customStep(stepData, appearance)
  }

  return (
    <StepContainer
      onClick={() => (collapsed ? onClick() : null)}
      data-testid={`step-${stepData.id}`}
      className={getClassName('checklistStepContainer', appearance)}
      appearance={appearance}
    >
      <StepHeader className={getClassName('stepHeader', appearance)}>
        <HeaderLeft>
          <CheckBoxRow
            value={stepData.complete}
            style={{ width: 'auto', borderTop: 0 }}
            primaryColor={appearance?.theme?.colorPrimary}
            appearance={appearance}
          />
          <StepTitle
            appearance={appearance}
            className={getClassName('stepTitle', appearance)}
            dangerouslySetInnerHTML={sanitize(stepData.title)}
          />
        </HeaderLeft>

        <CollapseChevronContainer
          className={getClassName('stepChevronContainer', appearance)}
          onClick={() => onClick()}
        >
          <Chevron
            style={{ ...iconStyle, transition: 'transform 0.1s ease-in-out' }}
            color={appearance?.theme?.colorTextSecondary}
          />
        </CollapseChevronContainer>
      </StepHeader>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 1, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 1, height: 0 }}
            key={stepData.id}
            style={{ overflow: 'hidden' }}
          >
            {getCustomStep() ?? getDefaultStepContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </StepContainer>
  )
}
