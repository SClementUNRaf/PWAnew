// src/components/pantallas/MenuPrincipalSkeleton.tsx
import Skeleton from "../comunes/Skeleton";

export default function MenuPrincipalSkeleton() {
  return (

    <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 w-full max-w-md space-y-4">
            <Skeleton width="w-full" height="h-40" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton height="h-24" />
                    <Skeleton height="h-24" />
                    <Skeleton height="h-24" />
                    <Skeleton height="h-24" />
                </div>
        </div>
    </div>
  );
}
