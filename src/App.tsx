import { AddGoalButton, DataType } from "@/components/add-goal-button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { isSameDay } from "date-fns"
import { Check, Ellipsis, Trash } from "lucide-react"
import { useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { Button } from "./components/ui/button"
import { produce } from "immer"

function App() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [database, setDatabase] = useLocalStorage<DataType[]>(
    "retention-calender",
    []
  )

  const dataSource = database.filter((item) => isSameDay(item.date, date))

  function deleteEvent(groupId: string) {
    setDatabase((prevValue) => {
      return prevValue.filter((item) => item.groupId !== groupId)
    })
  }

  function markComplete(id: string) {
    setDatabase((prevValue) => {
      return produce(prevValue, (draft) => {
        const index = draft.findIndex((item) => item.id === id)
        draft[index].completed = true
      })
    })
  }

  return (
    <div className="flex flex-col h-full gap-4 p-8">
      <p className="text-3xl font-bold text-primary">Retention Calendar</p>
      <div className="grid h-full grid-cols-1 p-8 overflow-y-hidden border rounded-md lg:grid-cols-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          className="m-auto scale-125 border rounded-md shadow"
        />
        <div className="flex flex-col gap-4 overflow-y-scroll">
          <AddGoalButton selectedDate={date} open={open} setOpen={setOpen} />
          <div className="flex flex-col gap-4">
            {dataSource.map((item, index) => {
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.completed && <Check className="text-green-500" />}
                        {item.name}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" type="button">
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuItem
                            onClick={() => markComplete(item.id)}
                          >
                            <Check />
                            <span>Mark Complete</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="!text-destructive hover:!bg-destructive/10"
                            onClick={() => deleteEvent(item.groupId)}
                          >
                            <Trash />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardTitle>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
