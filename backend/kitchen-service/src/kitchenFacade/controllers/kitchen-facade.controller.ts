import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { KitchenFacadeService } from '../services/kitchen-facade.service';
import { RecipeNotFoundException } from '../exceptions/recipe-not-found.exception';
import { ApiTags } from '@nestjs/swagger';
import { ItemShortNameDto } from '../dto/item-short-name';

@ApiTags('Kitchen Facade')
@Controller('kitchen-facade')
export class KitchenFacadeController {
  constructor(private readonly kitchenFacadeService: KitchenFacadeService) {}

  @Post('meanCookingTime')
  async getRecipeByMenuItemShortName(
    @Body() itemShortNameDto: ItemShortNameDto,
  ) {
    try {
      const recipe =
        await this.kitchenFacadeService.getRecipeFromMenuItemShortName(
          itemShortNameDto.shortName,
        );
      return { meanCookingTimeInSec: recipe.meanCookingTimeInSec };
    } catch (error) {
      if (error instanceof RecipeNotFoundException) {
        throw new NotFoundException(
          `Recipe with shortName '${itemShortNameDto.shortName}' not found.`,
        );
      }
      throw error;
    }
  }
}
