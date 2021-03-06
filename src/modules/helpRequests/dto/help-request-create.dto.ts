import { ApiProperty } from '@nestjs/swagger';
import { AddressModel } from '../../../models/address.model';
import { HelpRequestStatus } from '../help-request-status';
import { IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateHelpRequestArticleDto {
  @ApiProperty({
    description: 'Article ID received from the article list',
    type: 'integer',
    format: 'int64',
  })
  readonly articleId!: number;

  @ApiProperty({
    description: 'Number of items',
    type: 'integer',
    format: 'int64',
  })
  readonly articleCount!: number;
}

export class HelpRequestCreateDto extends AddressModel {
  readonly articles?: CreateHelpRequestArticleDto[];

  readonly status?: HelpRequestStatus = HelpRequestStatus.PENDING;

  readonly additionalRequest?: string;
  readonly deliveryComment?: string;

  @IsOptional()
  @IsPhoneNumber('ZZ')
  readonly phoneNumber?: string;
}
