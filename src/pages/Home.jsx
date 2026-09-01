import Hero from '@/components/sections/Hero'
import FeaturedFilm from '@/components/sections/FeaturedFilm'
import GroupIndex from '@/components/sections/GroupIndex'
import { AllGroups } from '@/components/sections/VideoGroup'
import Statement from '@/components/sections/Statement'
import AboutBlock from '@/components/sections/AboutBlock'
import Clients from '@/components/sections/Clients'
import Contact from '@/components/sections/Contact'
import Field from '@/components/layout/Field'

export default function Home() {
  return (
    <>
      <Field name="chalk">
        <Hero />
      </Field>
      <FeaturedFilm />
      <GroupIndex />
      <AllGroups />
      <Statement />
      <AboutBlock compact />
      <Clients />
      <Contact />
    </>
  )
}
