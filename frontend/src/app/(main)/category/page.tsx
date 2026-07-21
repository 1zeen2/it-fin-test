export default function CategoryPage() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-[#f5f6f8]">
      <div className="flex flex-col items-center rounded-[12px] bg-white px-[40px] py-[50px] shadow-sm">
        {/* 메인 텍스트 */}
        <h1 className="text-[20px] font-bold text-[#121212]">
          추후 구현 예정인 페이지입니다.
        </h1>

        {/* 서브 텍스트 */}
        <p className="mt-[40px] text-[14px] text-[#949494]">
          {'<Link />로 페이지 이동만 구현해둔 상태'}
        </p>
      </div>
    </div>
  );
}
