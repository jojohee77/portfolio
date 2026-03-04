import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import AgOfficeDetail from './pages/projects/AgOfficeDetail'
import BbagleAiDetail from './pages/projects/BbagleAiDetail'
import GazetAiDetail from './pages/projects/GazetAiDetail'
import HamsterMbtiDetail from './pages/projects/HamsterMbtiDetail'
import HiddenAdDetail from './pages/projects/HiddenAdDetail'
import AbridgeDetail from './pages/projects/AbridgeDetail'
import GongjaDetail from './pages/projects/GongjaDetail'
import YaguinDetail from './pages/projects/YaguinDetail'
import TreasureDetail from './pages/projects/TreasureDetail'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/project/ag-office" element={<AgOfficeDetail />} />
        <Route path="/project/bbagle-ai" element={<BbagleAiDetail />} />
        <Route path="/project/gazet-ai" element={<GazetAiDetail />} />
        <Route path="/project/hamster-mbti" element={<HamsterMbtiDetail />} />
        <Route path="/project/hidden-ad" element={<HiddenAdDetail />} />
        <Route path="/project/abridge" element={<AbridgeDetail />} />
        <Route path="/project/gongja" element={<GongjaDetail />} />
        <Route path="/project/yaguin" element={<YaguinDetail />} />
        <Route path="/project/treasure" element={<TreasureDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
