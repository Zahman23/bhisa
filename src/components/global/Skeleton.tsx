const Skeleton = ({className="h-4 w-full"}:{className?:string}) => {
return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
}

export default Skeleton