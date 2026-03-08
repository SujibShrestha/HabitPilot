import { useSelector } from "react-redux"
import type { RootState } from "../store/store";


const MainLayout = () => {
    const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div>MainLayout
    <h1>Hello {user?.name.toUpperCase()} </h1>
    </div>
  )
}

export default MainLayout