import CategoryMenu from "@/components/navigation/CategoryMenu";

export default function CommerceLayout({ children }) {
  return (
    <>
      <CategoryMenu />
      <div className="pt-[56px]">
        {children}
      </div>
    </>
  );
}
