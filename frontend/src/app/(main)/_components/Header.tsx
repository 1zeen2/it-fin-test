import HeaderDesktop from './HeaderDesktop';
import HeaderMobile from './HeaderMobile';
import Gnb from './Gnb';

export default function Header() {
  return (
    <>
      <div className="block max-[1152px]:hidden">
        <HeaderDesktop gnb={<Gnb />} />
      </div>
      <div className="hidden max-[1152px]:block">
        <HeaderMobile />
      </div>
    </>
  );
}
