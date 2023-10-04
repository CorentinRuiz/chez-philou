import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { KitchenFacadeService } from '../services/kitchen-facade.service';
import { RecipeNotFoundException } from '../exceptions/recipe-not-found.exception';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Kitchen Facade')
@Controller('kitchen-facade')
export class KitchenFacadeController {
  constructor(private readonly kitchenFacadeService: KitchenFacadeService) {}

  @Get('meanCookingTime/:menuItemShortName')
  async getRecipeByMenuItemShortName(
    @Param('menuItemShortName') menuItemShortName: string,
  ) {
    try {
      const recipe =
        await this.kitchenFacadeService.getRecipeFromMenuItemShortName(
          menuItemShortName,
        );
      return { meanCookingTimeInSec: recipe.meanCookingTimeInSec };
    } catch (error) {
      if (error instanceof RecipeNotFoundException) {
        throw new NotFoundException(
          `Recipe with shortName '${menuItemShortName}' not found.`,
        );
      }
      throw error;
    }
  }
}
