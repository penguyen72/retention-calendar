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
    <div className="flex flex-col h-full gap-4 p-6 lg:p-8">
      <div>
        <p className="text-3xl font-bold text-primary">Retention Calendar</p>
        <p className="max-w-4xl italic">
          Improve retention and recall by tracking learning progress and
          reinforcing knowledge with spaced repetition and active recall,
          following insights from the Ebbinghaus Forgetting Curve.
        </p>
      </div>
      <div className="grid h-full grid-cols-1 gap-12 p-8 border rounded-md lg:overflow-y-hidden lg:grid-cols-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          className="m-auto scale-110 border rounded-md shadow lg:scale-125"
        />
        <div className="flex flex-col gap-4 lg:overflow-y-scroll">
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
