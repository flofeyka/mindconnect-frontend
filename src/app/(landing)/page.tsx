import AppScreen from '@components/AppScreen'
import CustomButton from '@components/CustomButton'
import Icon from '@components/Icon'
import ProblemSolution from '@containers/landing-page/ProblemSolution/ProblemSolution'
import FindSpecialist from '@containers/landing-page/findSpecialist/FindSpecialist'
import FunctionalCard from '@containers/landing-page/functional/FunctionalCard'
import TitleHero from '@containers/landing-page/hero/TitleHero'
import { FC } from 'react'

const LandingPage: FC = () => {
  return (
    <div>
      <TitleHero />
      <div className="flex justify-center gap-4 mt-[45px]">
        <CustomButton color="primary">Get a service</CustomButton>
        <CustomButton
          color="default"
          startContent={
            <Icon
              width="16px"
              height="17px"
              path="icons/quick-support.svg"
            />
          }
        >
          Quick support
        </CustomButton>
      </div>
      <AppScreen />
      <ProblemSolution />
      <FunctionalCard />
      <FindSpecialist />
    </div>
  )
}

export default LandingPage
