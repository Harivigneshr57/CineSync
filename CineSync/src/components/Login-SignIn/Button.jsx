export default function Button({children,className,onClick,id,icon,ref}){
    return(
        <button className={className} ref={ref} onClick={onClick} id={id}>{icon} {children}</button>
    )
}