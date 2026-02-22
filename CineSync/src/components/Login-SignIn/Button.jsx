export default function Button({children,className,onClick,style,id,icon,ref}){
    return(
        <button className={className} style={style} ref={ref} onClick={onClick} id={id}>{icon} {children}</button>
    )
}