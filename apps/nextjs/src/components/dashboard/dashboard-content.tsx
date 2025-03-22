"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Hash, Layers, MessageSquare } from "lucide-react";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardContent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["home-data"],
    queryFn: async () => {
      const response = await axios.get("/api/home");
      const result = response.data.result;
      const parsedData = z
        .object({
          channels: z.number(),
          integrations: z.number(),
          messages: z.number(),
        })
        .parse(result);
      return parsedData;
    },
  });

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Integrations</h3>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Layers className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">
            {isLoading ? <Skeleton className="h-9 w-6" /> : data.integrations}
          </p>
          <p className="text-sm text-gray-500 mt-2">Active connections</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Channels</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Hash className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">
            {isLoading ? <Skeleton className="h-9 w-6" /> : data.channels}
          </p>
          <p className="text-sm text-gray-500 mt-2">Across all integrations</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-medium">Messages</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-bold">
            {isLoading ? <Skeleton className="h-9 w-6" /> : data.messages}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {isLoading ? (
              <Skeleton className="h-5 w-24 rounded-sm" />
            ) : (
              `Across ${data.channels} channels`
            )}
          </p>
        </div>
      </div>
    </>
  );
};
