import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'


function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Dosage</TableHead>
            <TableHead>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Medication 1</TableCell>
            <TableCell>10mg</TableCell>
            <TableCell>Morning</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Button>Click me</Button>
    </div>
  )
}

export default App
