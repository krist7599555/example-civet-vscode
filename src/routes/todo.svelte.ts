export function createTodo() {
  let list = $state<{ message: string; complete: false }[]>([]);
  let add = (message: string) => list.push({ message, complete: false });
  return {
    list,
    add,
  };
}
