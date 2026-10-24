import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PharmacyService } from './pharmacy.service'

@Controller('pharmacy')
@UseGuards(JwtAuthGuard)
export class PharmacyController {
  constructor(private svc: PharmacyService) {}

  @Get('medicines')
  async searchMedicines(@Query('q') query: string, @Query('take') take?: string) {
    return this.svc.searchMedicines(query || '', take ? Number(take) : 20)
  }

  @Get('molecules')
  async searchMolecules(@Query('q') query: string, @Query('take') take?: string) {
    return this.svc.searchMolecules(query || '', take ? Number(take) : 10)
  }

  @Get('doctors')
  async getDoctors(@Query('specialty') specialty?: string) {
    return this.svc.getDoctors(specialty)
  }

  @Get('pharmacies')
  async getPharmacies(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.svc.getNearbyPharmacies(Number(lat) || 0, Number(lng) || 0)
  }

  // AI-analysis-driven medicine/supplement + doctor suggestions, backed by the
  // live Pharmacy API. Pass ?reportId= to target a specific report, otherwise
  // the user's most recently completed report is used.
  @Get('suggestions')
  async getSuggestions(@Req() req: any, @Query('reportId') reportId?: string) {
    return this.svc.getSuggestionsForUser(req.user.userId, reportId)
  }
}
