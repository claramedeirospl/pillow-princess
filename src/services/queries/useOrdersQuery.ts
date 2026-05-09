import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOrdersStore } from "@/store/ordersStore";
import type { Order } from "@/@types";

const ORDERS_KEY = ["orders"] as const;

export function useOrdersQuery(userId: string) {
  return useQuery({
    queryKey: [...ORDERS_KEY, userId],
    queryFn: () => useOrdersStore.getState().getOrdersByUser(userId),
    enabled: !!userId,
  });
}

export function usePlaceOrderMutation() {
  const qc = useQueryClient();
  const { addOrder } = useOrdersStore();

  return useMutation({
    mutationFn: async (order: Order) => {
      addOrder(order);
      return order;
    },
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: [...ORDERS_KEY, order.userId] });
    },
  });
}
