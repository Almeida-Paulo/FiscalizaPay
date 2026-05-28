export * from "./model/types";
export * from "./model/constants";
// store.ts não está no barrel para evitar importação acidental em Server Components
// Use: import { useProfileStore } from "@/entities/profile/model/store"
