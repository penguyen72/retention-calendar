import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { DataType } from "@/lib/types"
import { produce } from "immer"
import { Check, Ellipsis, Trash, X } from "lucide-react"
import { useLocalStorage, useMediaQuery } from "usehooks-ts"

interface Props {
  item: DataType
}

export function EventMenu({ item }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [database, setDatabase] = useLocalStorage<DataType[]>(
    "retention-calender",
    []
  )
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

  function markIncomplete(id: string) {
    setDatabase((prevValue) => {
      return produce(prevValue, (draft) => {
        const index = draft.findIndex((item) => item.id === id)
        draft[index].completed = false
      })
    })
  }

  if (isDesktop) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" type="button">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => markComplete(item.id)}>
            <Check className="text-green-500" />
            <span>Mark Complete</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => markIncomplete(item.id)}>
            <X className="text-red-600" />
            <span>Mark Incomplete</span>
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            className="!text-destructive hover:!bg-destructive/10"
            onClick={() => deleteEvent(item.groupId)}
          >
            <Trash />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return (
    <Drawer>
      <DrawerTrigger>
        <Button size="icon" variant="ghost" type="button">
          <Ellipsis />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col gap-4 p-4">
          <Button variant="outline" onClick={() => markComplete(item.id)}>
            <Check className="text-green-500" />
            <span>Mark Complete</span>
          </Button>
          <Button variant="outline" onClick={() => markIncomplete(item.id)}>
            <X className="text-red-600" />
            <span>Mark Incomplete</span>
          </Button>
          <Separator />
          <Button
            variant="outline"
            className="!text-destructive hover:!bg-destructive/10"
            onClick={() => deleteEvent(item.groupId)}
          >
            <Trash />
            <span>Delete</span>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
