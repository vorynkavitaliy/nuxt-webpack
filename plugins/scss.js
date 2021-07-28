import colors from '@/assets/styles/variables/components/_colors.scss'
import breakpoints from '@/assets/styles/variables/components/_breakpoints.scss'
export default function(_, inject) {
    inject('color', colors)
    inject('breakpoints', breakpoints)
}
