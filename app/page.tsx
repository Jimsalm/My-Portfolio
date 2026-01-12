import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-4 text-2xl font-bold">Hello World</h1>
      
      <Button variant="default">Click me</Button>
      <Button variant="outline">Secondary Action</Button>
    </main>
  )
}