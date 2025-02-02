import { AddGoalButton } from "@/components/add-goal-button"
import { EventMenu } from "@/components/event-menu"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { DataType } from "@/lib/types"
import { isSameDay } from "date-fns"
import { Check, X } from "lucide-react"
import { useState } from "react"
import { useLocalStorage } from "usehooks-ts"

function App() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>(new Date())
  const [database, setDatabase] = useLocalStorage<DataType[]>(
    "retention-calender",
    []
  )

  const dataSource = database.filter((item) => isSameDay(item.date, date))

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col flex-1 gap-4 m-6 lg:m-8">
        <div>
          <p className="text-3xl font-bold text-primary">Retention Calendar</p>
          <p className="max-w-4xl italic">
            Improve retention and recall by tracking learning progress and
            reinforcing knowledge with spaced repetition and active recall,
            following insights from the Ebbinghaus Forgetting Curve.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-1 gap-12 p-8 border rounded-md lg:overflow-y-hidden lg:grid-cols-2">
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
                          {item.completed ? (
                            <Check className="text-green-500" />
                          ) : (
                            <X className="text-red-600" />
                          )}
                          {item.name}
                        </div>
                        <EventMenu item={item} />
                      </CardTitle>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
