export default function Wrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="wrapper bg-primary">
      {children}
    </div>
  )
}
